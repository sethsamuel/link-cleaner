import React, { useEffect, useState } from "react";
import css from "./App.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
const BLACKLIST = [/utm_.*/, /fb.*/, "ref"];

const isClean = (k: string) => {
  for (const b of BLACKLIST) {
    if (
      (typeof b === "string" && k === b) ||
      (b instanceof RegExp && b.test(k))
    ) {
      return false;
    }
  }
  return true;
};

function App() {
  const [rawValue, setRawValue] = useState<string>();
  const [value, setValue] = useState<string>();
  const cleanValue = () => {
    if (!rawValue) {
      setValue("");
      return;
    }
    try {
      const url = new URL(rawValue);
      const cleanQueryParams = new Map<string, string>();
      for (const q of url.searchParams.entries()) {
        const [k, v] = q;
        if (isClean(k)) {
          cleanQueryParams.set(k, v);
        }
      }
      let value = url.protocol + "//" + url.host + url.pathname;

      if (cleanQueryParams.size > 0) {
        value += "?";
        for (const q of cleanQueryParams.entries()) {
          value += `${q[0]}=${q[1]}`;
        }
      }
      setValue(value);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    cleanValue();
  }, [rawValue]);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawValue(e.target.value);
  };

  const onCopy = () => {
    if (!value) {
      return;
    }
    console.log(value);
    const copy = async () => {
      await navigator.clipboard.writeText(value);
    };
    copy();
  };

  return (
    <section className={css.container}>
      <input type="text" value={value} onChange={onChange} />
      <button onClick={onCopy}>
        <FontAwesomeIcon icon={faCopy} />
      </button>
    </section>
  );
}

export default App;
