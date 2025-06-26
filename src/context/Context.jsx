import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("")
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false);
    const [resultData, setResultDataState] = useState("");
    
    const delayPara = (index, nextWord) => {
        setTimeout(function () { 
            setResultDataState(prev => prev+ nextWord);
        },75*index)
    }       

    const onSent = async (prompt) => {
    setResultDataState("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(input);
    setPrevPrompts(prev => [... prev, input])

    const response = await runChat(input);
    let responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
        if (i % 2 === 0) {
            newResponse += responseArray[i];
        } else {
            newResponse += "<b>" + responseArray[i] + "</b>";
        }
    }

    // Replace * with <br> if that's how your API sends line breaks
    let newResponse2 = newResponse.split("*").join("<br>");
    let newResponseArray = newResponse2.split(" ");
    for(let i = 0 ; i < newResponseArray.length ; i++){
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord+ ' ');
    }
    setLoading(false);
    setInput("");
}

    // onSent("What is react Js?")

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider