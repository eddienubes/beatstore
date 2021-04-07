import React from "react";
import "./placeholder-animated-input.scss";

const PlaceholderAnimatedInput = (props) => {
    const [input, setInput] = React.useState(props.value || '');

    let labelClass = null;

    if (props.value && input) {
        labelClass += ' input-if-default-value';
    }
    if (input) {
        labelClass += ' input-if-default-value';
    }

    const registerProps = ["id", "onChange", "onBlur", "name", "placeholder", "type", "value"];
    let additionalProps;
    if (registerProps.every(p => props.hasOwnProperty(p))) {
        additionalProps = props;
    }

    const itemProps = {
        ...additionalProps,
        onChange: (e) => {
            setInput(e.target.value);
            if (props.onChange) {
                props.onChange(e)
            }
        },
        className: `${props.className} ${props.required === true ? "input-required" : "input-non-required"}`,
        name: props.name,
        required: props.required,
        disabled: props.disabled || false,
        type: props.type || 'text',
        onInput: props.onInput || null
    }

    const resizeTextArea = (e) => {
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
    }
    
    return (
        <div className={`input-container ${props.wrapper}`}>
            {props.textArea || false ? <textarea onKeyDown={resizeTextArea} style={{resize: 'none', padding: '10px'}} {...itemProps}/> : <input {...itemProps}/>}
            <label className={`component-label ${props.labelstyle} ${labelClass}`}>{props.text}</label>
        </div>
    );
};

export default PlaceholderAnimatedInput;