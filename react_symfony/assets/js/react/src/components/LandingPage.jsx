import React from "react";
import "../styles/landing.scss";
import family from "../../public/media/family.png";
import heroArt from "../../public/media/bogus-hero.png";
import bottomArt from "../../public/media/diagram.png"

export const LandingPage = () => {

    return (
        // common to all sections, to line up with top bar
        <div className="w-100 py-4">
            <div className="landing-section">
                <div className="hero-left">
                    <div className="hero-img-left">
                        <img src={family} alt="Section 1 Image" />
                    </div>
                    <div className="hero-text-left">
                        Quisque id neque id metus blandit porta at ac metus. Nulla facilisi.
                        Sed pretium felis et lorem molestie, sed ultricies lacus dictum.
                        Nam varius erat et vulputate porta. Integer venenatis dui mi, at sagittis elit finibus quis.
                        Nulla facilisi. Mauris suscipit at sapien non tempus. Suspendisse in dapibus lacus.
                    </div>
                </div>
                <div className="hero-right">
                    <div className="landing-art-top">
                        <img src={heroArt} alt="Digital Art Household" />
                    </div>
                </div>
            </div>

            <div className="landing-section">
                <div className="hero-left">
                    <div className="hero-text-right">
                        Quisque id neque id metus blandit porta at ac metus. Nulla facilisi.
                        Sed pretium felis et lorem molestie, sed ultricies lacus dictum.
                        Nam varius erat et vulputate porta. Integer venenatis dui mi, at sagittis elit finibus quis.
                        Nulla facilisi. Mauris suscipit at sapien non tempus. Suspendisse in dapibus lacus.
                    </div>
                </div>
                <div className="hero-right">
                    <div className="landing-art-top">
                        <img src={bottomArt} alt="Digital Art Bottom" />
                    </div>
                </div>
            </div>

            <div className="landing-cta-section">

            </div>
        </div>
    );
};