import {forwardRef, useImperativeHandle, useReducer} from "react";

const FendaDanmuMessage = ({msg}, ref) => {
    const _style = {
        // border: '1px solid red',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        position: 'absolute',
        left: '100%',
        top: '0%',
        animationName: 'fenda-danmu-move',
        animationDuration: '5s',
        animationIterationCount: '1',
        animationFillMode: 'forwards',
        animationTimingFunction: 'linear',
        fontSize: 16,
        color: "white",
    }
    _style['top'] = msg.top;
    return (
        <div style={{..._style}}>
            {msg.messageObj.data}
            <style jsx>{`
              @keyframes fenda-danmu-move {
                from {
                  left: 100%;
                }

                to {
                  left: -500px;
                }
              }
            `}</style>
        </div>
    )
}

function getTop() {
    return Math.ceil(Math.random() * 10) * 18 + 'px'
}

export const FendaDanmu = forwardRef(function FendaDanmu(props, ref) {
    const [msg, dispatchMsg] = useReducer((state, action) => [...state, action].slice(-200),
        [], r => r);
    useImperativeHandle(ref, () => {
        return {
            addMessage(m) {
                dispatchMsg({messageObj: m, top: getTop()})
            }
        };
    }, []);
    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden'
        }}>
            {msg.map(e => {
                return <FendaDanmuMessage key={e.messageObj.id} msg={e}/>
            })}
        </div>
    )
})