import styles from './WidthDiv.module.css';

export function FixWidthDiv({children}) {
    return (
        <div className={styles.fix_width_div}>{children}</div>
    );
}

export function FullWidthDiv({children}) {
    return (
        <div className={styles.full_width_div}>{children}</div>
    );
}