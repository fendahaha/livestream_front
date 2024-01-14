export default function Component({children}) {
    return (
        <div style={{width: '100%', height: '100%', position: 'relative'}}>
            {children}
        </div>
    );
}