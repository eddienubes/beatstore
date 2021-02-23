import React, { useEffect, useState } from "react";

const AnimationContainer = ({ show, children, animationMountClass, animationUnMountClass }) => {
    const [shouldRender, setRender] = useState(show);

    useEffect(() => {
        if (show) setRender(true);
    }, [show]);

    const onAnimationEnd = () => {
        if (!show) setRender(false);
    };

    return (
        shouldRender && (
            <div
                // style={{ animation: `${show ? "fadeIn" : "fadeOut"} 1s` }}
                className={show ? animationMountClass : animationUnMountClass }
                onAnimationEnd={onAnimationEnd}
            >
                {children}
            </div>
        )
    );
};

export default AnimationContainer;