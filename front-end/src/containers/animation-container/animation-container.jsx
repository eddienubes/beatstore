import React, { useEffect, useState } from "react";
import {useSelector} from "react-redux";

const AnimationContainer = ({showDefault, children, animationMountClass, animationUnMountClass }) => {
    const [shouldRender, setRender] = useState(showDefault || true);
    const [show, setShow] = useState(showDefault || true);

    useEffect(() => {
        if (show) setRender(true);
    }, [show]);

    const onAnimationEnd = () => {
        if (!show) setRender(false);

    };

    return (
        shouldRender &&
            React.cloneElement(children, {
                className: show ? animationMountClass : animationUnMountClass,
                onAnimationEnd: onAnimationEnd,
                setShow: setShow,
                show
            })
    );
};

export default AnimationContainer;