'use client'
import styles from "./slider.module.css";
import {useEffect, useState} from "react";
import {Carousel} from "antd";

export function MyCarousel({data}) {
    return (
        <Carousel autoplay>
            {data.map(e => {
                return <div key={e.img}>
                    <a href={e.link} className={styles.carouselItem}>
                        <img src={e.img} alt={''}/>
                    </a>
                </div>
            })}
        </Carousel>
    );
}

const transition_style = "margin-left 0.3s linear";
export default function Slider({items}) {
    const [currIndex, setCurrIndex] = useState(0);
    const [t, setT] = useState(transition_style);
    let s = {
        'marginLeft': `calc(-100% * ${currIndex})`,
        'transition': t,
    };

    useEffect(() => {
        const d = setInterval(() => {
            let nextIndex = currIndex + 1;
            if (nextIndex > (items.length - 1)) {
                nextIndex = 0
                setT('none');
                setCurrIndex(nextIndex);
            } else {
                setT(transition_style);
                setCurrIndex(nextIndex);
            }
        }, 1000 * 2)
        return () => clearInterval(d)
    }, [currIndex, items.length]);
    return (
        <div className={styles.slider}>
            <div className={styles.slider_content} style={s}>
                {items.map(e => {
                    return (
                        <a className={styles.slider_item} href={""} key={e}>
                            <img src={e} alt={""} className={styles.img}/>
                        </a>
                    )
                })}
            </div>
        </div>
    );
}