import satori, { SatoriOptions, Font } from "satori";
import { SITE } from "@config";
import { writeFile, mkdir } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";

interface Root {
  zipName: string;
  manifest: Manifest;
}

interface Manifest {
  files: File[];
  fileRefs: FileRef[];
}

interface File {
  filename: string;
  contents: string;
}

interface FileRef {
  filename: string;
  url: string;
  date: Date;
}

interface Date {
  seconds: number;
  nanos: number;
}

const weightMap = {
  Thin: 100,
  ExtraLight: 200,
  Light: 300,
  Regular: 400,
  Medium: 500,
  SemiBold: 600,
  Bold: 700,
  ExtraBold: 800,
  Black: 900,
} as Record<string, number>;

const fetchFonts = async () => {
  const listResponse = await fetch(
    "https://fonts.google.com/download/list?family=Noto%20Serif%20SC"
  ).then(res => res.text());
  const listJson = JSON.parse(listResponse.replace(")]}'", "")) as Root;
  const fontFiles = listJson.manifest.fileRefs;

  const allFonts = await Promise.all(
    fontFiles.map(async font => {
      const fontResponse = await fetch(font.url).then(res => res.arrayBuffer());
      const fontBuffer = Buffer.from(fontResponse);
      const weightString = font.filename.match(
        /(Thin|Light|Regular|Medium|Bold|Black|ExtraBold|SemiBold|ExtraLight)/
      )?.[1];
      const weight = weightMap[weightString ?? "Regular"];

      return {
        name: "Noto Serif SC",
        data: fontBuffer,
        weight: weight,
        style: "normal",
      } as Font;
    })
  );
  return allFonts;
};

const fonts = await fetchFonts();

const ogImage = (text: string) => {
  return (
    <div
      style={{
        background: "#fefbfb",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-1px",
          right: "-1px",
          border: "4px solid #000",
          background: "#ecebeb",
          opacity: "0.9",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          margin: "2.5rem",
          width: "88%",
          height: "80%",
        }}
      />

      <div
        style={{
          border: "4px solid #000",
          background: "#fefbfb",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          margin: "2rem",
          width: "88%",
          height: "80%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            margin: "20px",
            width: "90%",
            height: "90%",
          }}
        >
          <p
            style={{
              fontSize: 72,
              fontWeight: "bold",
              maxHeight: "84%",
              overflow: "hidden",
            }}
          >
            {text}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: "8px",
              fontSize: 28,
            }}
          >
            <span>
              by{" "}
              <span
                style={{
                  color: "transparent",
                }}
              >
                "
              </span>
              <span style={{ overflow: "hidden", fontWeight: "bold" }}>
                {SITE.author}
              </span>
            </span>

            <span style={{ overflow: "hidden", fontWeight: "bold" }}>
              {SITE.title}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts: fonts,
};

const generateOgImage = async (mytext = SITE.title) => {
  const svg = await satori(ogImage(mytext), options);

  // render png in production mode
  if (import.meta.env.MODE === "production") {
    const resvg = new Resvg(svg);
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    console.info("Output PNG Image  :", `${mytext}.png`);

    await mkdir("./dist/assets/post", { recursive: true });
    await writeFile(`./dist/assets/post/${mytext}.png`, pngBuffer);
  }

  return svg;
};

export default generateOgImage;
