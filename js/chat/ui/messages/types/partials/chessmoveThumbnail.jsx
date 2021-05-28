import React, { useRef, useEffect } from 'react';

const ChessmoveThumbnail = props => {
    const canvasRef = useRef(null);
    const { previousstate, boardstate, move, ...rest } = props;

    const draw = (canvas, ctx) => {
        console.log("Board State: ", boardstate);
        ctx.clearRect(0,0,canvas.width,canvas.height);

        mega.chess.renderpreview(canvas, ctx, previousstate, boardstate, move);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        draw(canvas, context);
    }, [draw, boardstate]);

    return <canvas className="chessmove-preview-thumbnail" ref={canvasRef} {...rest}/>;
};

export default ChessmoveThumbnail;
