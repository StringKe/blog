import { useEffect } from "react";
import * as autocorrect from "@huacnlee/autocorrect";

export function LoadAutoCorrect() {
  useEffect(() => {
    // 递归 body 下的所有元素，如果是文本节点，就进行纠正，跳过 script 标签 和 style 标签
    function recursive(node: Node) {
      if (
        node.nodeType === Node.TEXT_NODE &&
        node.parentNode?.nodeName !== "SCRIPT" &&
        node.parentNode?.nodeName !== "STYLE"
      ) {
        const textContent = node?.textContent;
        // 剔除空白字符 和 空白行
        if (textContent && textContent.trim().length > 0) {
          const newText = autocorrect.format(textContent);
          if (newText !== textContent) {
            node.textContent = newText;
          }
        }
      } else {
        node.childNodes.forEach(recursive);
      }
    }

    recursive(document.body);
  }, []);

  return null;
}
