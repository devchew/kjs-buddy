declare module '*.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.png' {
    const src: string;
    export default `data:image/png;base64, ${src}`;
}
