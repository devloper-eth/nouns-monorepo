import React, { useEffect, useRef } from 'react';
import classes from './UpdatedConfetti.module.css';

const UpdatedConfetti: React.FC<{ height: number; width: number }> = props => {
  const { height, width } = props;
  let canvasRef = useRef<HTMLCanvasElement>(null);

  let startTime = new Date().getTime();
  let currentTime = startTime;

  let items: any[] = [];
  const colors = ['#2B83F6', '#4BEA69', '#5648ED', '#F3322C', '#F68EFF', '#FF638D', '#FFF449'];

  let index = 150;

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        render(ctx);
      }
    }
  });

  // function resize() {
  //   width = canvas.width = window.innerWidth;
  //   height = canvas.height = window.innerHeight;
  // }

  function render(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, width, height);
    var time = new Date().getTime();
    var delta = (time - currentTime) / (1000 / 60);
    currentTime = time;

    if (time - startTime > 1500) {
      items[++index % 300] = particle(Math.random() * width, -20, index, 10);
    }

    items.forEach(function (item) {
      item.vx *= 1.0 - 0.05 * delta;
      item.vy += delta * item.fallSpeed;
      item.vy /= 1.0 + 0.05 * delta;
      item.x += delta * item.vx;
      item.y += delta * item.vy;
      item.rotate += delta * item.direction;

      ctx.fillStyle = item.color;
      if (item.circle) {
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.width / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
      } else {
        ctx.save();
        ctx.beginPath();
        ctx.translate(item.x, item.y);
        ctx.rotate((item.rotate * Math.PI) / 180);
        ctx.fillRect(-item.width / 2, -item.height / 2, item.width, item.height);
        ctx.translate(-item.x, -item.y);
        ctx.restore();
        ctx.closePath();
      }
    });

    window.requestAnimationFrame(() => render(ctx));
  }

  function particle(x: number, y: number, i: number, minv: number) {
    let angle = Math.random() * (Math.PI * 2);
    let amount = Math.random() * 15.0 + minv;
    let vx = Math.sin(angle) * amount;
    let vy = Math.cos(angle) * amount;

    return {
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      width: Math.random() * 8 + 8,
      height: Math.random() * 10 + 8,
      color: colors[i % colors.length],
      // circle: Math.random() > 0.8,
      rotate: Math.random() * 180,
      direction: Math.random() * 5 - 2.5,
      fallSpeed: Math.random() / 10 + 0.1,
    };
  }

  return <canvas className={classes.confettiContainer} ref={canvasRef} id="confetti" />;
};

export default UpdatedConfetti;
