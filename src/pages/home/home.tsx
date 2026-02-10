import { useGSAP } from "@gsap/react";
import React, { useRef } from "react";
import { SplitText } from "gsap/all";
import gsap from "gsap";
import { useMediaQuery } from "react-responsive";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroVideo from "@/constants/videos/outputDroneRealFinal.mp4";

gsap.registerPlugin(ScrollTrigger, SplitText);
const HomePage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const isMobile = useMediaQuery({ maxWidth: 767 });

  //create callback function for gsap animations
  useGSAP(() => {
    // gsap animations will go here

    //split text animation
    const heroSplit = new SplitText(".title", { type: "chars, words" });

    const paraSplit = new SplitText(".subtitle", { type: "lines" });

    heroSplit.chars.forEach((char) => {
      char.classList.add("text-gradient");
    });

    gsap.from(heroSplit.chars, {
      yPercent: 100,
      duration: 1.8,
      ease: "expo.out",
      stagger: 0.06,
    });

    paraSplit.lines.forEach((line) => {
      line.classList.add("line");
    });

    gsap.from(paraSplit.lines, {
      opacity: 0,
      yPercent: 100,
      duration: 1.8,
      ease: "expo.out",
      stagger: 0.06,
      delay: 1,
    });

    //make a timeline

    //when the top of the video hits the center of the viewport, play the video if mobile
    //else when the center of the video hits 60% of the viewport height, play the video
    const startValue = isMobile ? "top 50%" : "center 60%";
    const endValue = isMobile ? "120% top" : "bottom top";

    //second parameter is an empty array to run only once on mount

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "video",
        start: startValue,
        end: endValue,
        scrub: true,
        pin: true,
      },
    });

    videoRef.current.onloadedmetadata = () => {
      tl.to(videoRef.current, {
        currentTime: videoRef.current.duration,
      });
      // This makes the video scale up slightly as you scroll down
      tl.to(
        videoRef.current,
        {
          scale: 0.5,
          ease: "power2.inOut",
          opacity: 0.7,
        },
        0,
      );

      tl.to(
        videoRef.current,
        {
          xPercent: 120, // 120 ensures it's fully clear of any padding
          opacity: 0, // Optional: fade it out as it leaves
          ease: "expo.out",
          filter: "blur(10px)",
        },
        1,
      );
    };
  }, []);

  return (
    <>
      <section
        id="hero"
        className="relative z-10 min-h-dvh w-full border border-transparent "
      >
        <div className="noisy fixed inset-0 z-[100] pointer-events-none opacity-[0.03]" />
        <h1 className="title md:mt-32 mt-40 text-2xl md:text-[20vw] leading-none text-center text-red-600 opacity-[65]">
          RAPHAEL
        </h1>

        <div className="container mx-auto absolute left-1/2 -translate-x-1/2 lg:bottom-20 top-auto md:top-[30vh] flex justify-between items-end px-5">
          <div className="flex lg:flex-row flex-col w-full gap-10 justify-between items-center lg:items-end mx-auto;">
            <div className="space-y-5 hidden md:block ">
              <p> Admin Dashboard</p>
              <p className="subtitle text-3xl -mb-2 text-red-500">
                The Future of Command
              </p>
            </div>
            <div className="view-cocktails">
              <p className="subtitle text-3xl -mb-2">
                Deploy specialized Autonomous Combat Platforms (ACPs), monitor
                real-time telemetry, and oversee mission-critical operations
                through the RAPHAEL interface.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10  w-full border  border-transparent items:center min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8 p-16 mb-7 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl  max-w-5xl w-full ">
          <h2 className="text-6xl md:text-8xl lg:text-9xlfont-modern-negra text-white tracking-widest">
            ACCESS GATEWAY
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center h:200px">
            <a
              href="/login"
              className="px-20 py-8 text-2xl md:text-3xl  bg-red-600 text-white font-bold transition-all duration-300 hover:shadow-[0_0_40px_rgba(220,38,38,0.8)] hover:box-transition-all uppercase tracking-tighter"
            >
              LOGIN
            </a>
            <a
              href="/register"
              className="px-20 py-8 text-2xl md:text-3xl border border-white/20 transition-all duration-300 text-white font-bold hover:bg-white/10 transition-all uppercase tracking-tighter"
            >
              SIGN UP
            </a>
          </div>
        </div>
      </section>

      <div className="absolute inset-0 video">
        <video
          ref={videoRef}
          src={heroVideo}
          muted
          playsInline
          preload="auto"
          className="w-full md:h-[80%] h-1/2 absolute bottom-0 left-0 md:object-contain object-bottom object-cover;"
        />
      </div>
      <footer className="relative z-10 py-6 text-center">
        <p className="text-white/60 text-sm">© 2026 Alan Thomas</p>
      </footer>
    </>
  );
};

export default HomePage;
