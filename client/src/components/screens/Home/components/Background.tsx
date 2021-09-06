import { useEffect, useRef, useState } from 'react'
import "./Background.css"

export default function Background() {

    const dotSize = 4
    const dotMargin = 24
    const dotInitialAlpha = 0.20

    const [windowWidth, setWindowWidth] = useState(window.innerWidth - dotMargin)
    const [windowHeight, setWindowHeight] = useState(window.innerHeight - dotMargin)

    let debouncer: NodeJS.Timeout | undefined = undefined
    
    const getHorizontalDotCount = () => Math.floor(windowWidth / (dotSize + dotMargin))
    const getVerticalDotCount = () => Math.floor(windowHeight / (dotSize + dotMargin))
    const getPaddingHorizontal = () => windowWidth - (getHorizontalDotCount() * dotSize + (getHorizontalDotCount() - 1) * dotMargin)
    const getPaddingVertical = () => windowHeight - (getVerticalDotCount() * dotSize + (getVerticalDotCount() - 1) * dotMargin)
    
    const canvasRef = useRef(null)
    
    const [dots, setDots] = useState<Array<Array<number>>>(getDotArray())

    useEffect(() => {

        window.addEventListener("resize", onResize)

        draw()
        return () => {
            window.removeEventListener("resize", onResize)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function getDotArray() {
        const dots: Array<Array<number>> = []

        for (let y = 0; y < getVerticalDotCount(); y++) {
            dots.push([])
            for (let x = 0; x < getHorizontalDotCount(); x++) {
                dots[y].push(dotInitialAlpha)               
            }
        }
        return dots
    }

    function onResize() {
        const debounceDelay = 500

        if (debouncer)
            clearTimeout(debouncer)
        
        debouncer = setTimeout(() => {
            console.log(window.innerWidth, window.innerHeight)
            setWindowWidth(window.innerWidth - dotMargin)
            setWindowHeight(window.innerHeight - dotMargin)

            //setDots(getDotArray())
            setTimeout(draw)
        }, debounceDelay)
    }

    function draw() {
        const canvas = canvasRef.current as HTMLCanvasElement | null
        const context = canvas?.getContext('2d')

        if (canvas == null || context == null) {
            return
        }
        
        context.save()
        context.clearRect(0, 0, windowWidth, windowHeight)
        context.scale(devicePixelRatio, devicePixelRatio)

        for (let y = 0; y < dots.length; y++) {
            for (let x = 0; x < dots[y].length; x++) {

                context.fillStyle = `rgba(255,255,255,${dots[y][x]})`

                context.beginPath()
                context.arc(
                    getPaddingHorizontal() / 2 + (dotSize + dotMargin) * x, 
                    getPaddingVertical() / 2 + (dotSize + dotMargin) * y,
                    dotSize / 2, 
                    0, 
                    Math.PI * 2
                )
                context.fill();
            }
        }
        context.restore()
    }
    
    return <canvas 
        className="canvas" 
        ref={canvasRef} 
        width={windowWidth * devicePixelRatio} 
        height={windowHeight * devicePixelRatio} 
        style={{
            width: windowWidth,
            height: windowHeight
        }} 
    />
}