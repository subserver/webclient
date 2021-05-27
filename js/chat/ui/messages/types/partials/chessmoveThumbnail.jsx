import React, { useRef, useEffect } from 'react';

const ChessmoveThumbnail = props => {
    const canvasRef = useRef(null);
    const { boardstate, ...rest } = props;

    const draw = (canvas, ctx) => {
        console.log("Board State: ", boardstate);
        ctx.clearRect(0,0,canvas.width,canvas.height);

        // Draw the tiles.
        const tileSize = canvas.width / 8;
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                ctx.beginPath();
                ctx.rect(x * tileSize, y * tileSize, tileSize, tileSize);
                let color = (y % 2 === 0) ? (x % 2 === 0 ? 0 : 1) : (x % 2 === 0 ? 1 : 0);
                ctx.fillStyle = color === 0 ? "grey" : "brown";
                ctx.fill();
            }
        }

        // Draw the boarder
        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.strokeStyle = "black";
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.stroke();
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        draw(canvas, context);
    }, [draw, boardstate]);

    return <canvas ref={canvasRef} {...rest}/>;
};

export default ChessmoveThumbnail;
