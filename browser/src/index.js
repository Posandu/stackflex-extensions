const createEL = (tag) => document.createElement(tag);
const $ = (selector) => document.querySelectorAll(selector);
const css = (el, values) => {
  Object.keys(values).forEach(key => {
    el.style[key] = values[key];
  });
};

const button_name = "extension-button"

const extCss = `      
button {
  background: #0660a2;
  border: none;
  color: white;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  padding: 3px 4px;
  font-family: system-ui;
}
button:hover {
  background: #055188;
}
button:active {
  box-shadow: 0px 0px 4px #0660a2;
}
button:focus {
  box-shadow: 0px 0px 8px #0660a2;
}



.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  background: #00000070;
  display: none;
  justify-content: center;
  align-items: center;
}
.open {
  display: flex;
}
iframe {
  border-radius: 4px;
  max-height: 700px;
  max-width: 700px;
  width: 100%;
  height: 100%;
  overflow: auto;
}


        `;

function render() {
  $("pre, code").forEach((el) => {
    // If parent is a <pre> or <code> tag, ignore
    if (el.parentElement.tagName === "PRE" || el.parentElement.tagName === "CODE") {
      return
    }


    /**
     * Remove all duplicate extension buttons
     */
    if (el.getAttribute("data-ext-button") === "true") {
      return
    }

    el.setAttribute("data-ext-button", "true");

    /**
     * If classlist contains CodeMirror, Monaco, or ace, ignore
     */
    if (/CodeMirror|ace_editor|monaco-editor/i.test(el.className)) {
      return
    }

    /**
     * Get the code
     */
    const insideText = el.innerText;

    /**
     * If the code is too short, ignore
     */
    if (insideText.trim().length <= 20) return


    /**
     * Get the code's bounding box
     */
    const rect = el.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();

    /**
     * Create the extension button 
     */
    const parent = createEL(button_name)
    const shadow = parent.attachShadow({ mode: 'open' });

    const button = createEL("button");
    const style = createEL("style");

    style.innerHTML = extCss;
    button.innerHTML = "Save";

    /**
     * Detect the language of the code
     */
    const detectLanguage = () => {
      const regex = /language-([a-zA-Z0-9]+)/;

      const parent = el.parentElement;
      const childrenPre = el.querySelector("pre");
      const childrenCode = el.querySelector("code"); // xD Children code

      let language = "plaintext";

      if (parent.tagName === "PRE") {
        const lang = parent.className.match(regex);
        if (lang) {
          language = lang[1];
        }
      }

      if (parent.tagName === "CODE") {
        const lang = parent.className.match(regex);
        if (lang) {
          language = lang[1];
        }
      }

      if (childrenPre) {
        const lang = childrenPre.className.match(regex);
        if (lang) {
          language = lang[1];
        }
      }

      if (childrenCode) {
        const lang = childrenCode.className.match(regex);
        if (lang) {
          language = lang[1];
        }
      }

      return language;
    }

    css(button, {
      position: "absolute",
      top: `${rect.top - bodyRect.top - 20}px`,
      left: `${rect.left - bodyRect.left}px`,
    });


    function urlencode(str) {
      return encodeURIComponent(str);
    }

    /**
     * Add elements to the DOM
     */
    shadow.appendChild(button);
    shadow.appendChild(style);
    document.body.appendChild(parent);

    /**
     * Add event listeners
     */
    button.onclick = () => {
      console.log("clicked")

      try {
        const title = urlencode(document.title.trim())
        const language = urlencode(detectLanguage().trim())
        const code = urlencode(insideText)

        const createURL = `https://stackflex.tronic247.com/createCode#${title}|${language}|${code}`

        window.open(createURL, "", "width=700,height=700");
      } catch (error) {
        console.log(error)
      }

    };
  })
}
render();

setInterval(render, 1000);