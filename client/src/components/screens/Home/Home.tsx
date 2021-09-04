import React from 'react'
import "./Home.css"
import { ReactComponent as FirstFloatingBox } from "assets/svgs/illustrations/Floatingbox#1.svg"
import { ReactComponent as SecondFloatingBox } from "assets/svgs/illustrations/Floatingbox#2.svg"
import { ReactComponent as ThirdFloatingBox } from "assets/svgs/illustrations/Floatingbox#3.svg"
import { ReactComponent as Deadline } from "assets/svgs/illustrations/Deadline.svg"
import { ReactComponent as Collaborate } from "assets/svgs/illustrations/undraw_collaborators_prrw.svg"
import { ReactComponent as CrowdSource } from "assets/svgs/illustrations/undraw_community_8nwl.svg"
import Background from './components/Background'

import { ReactComponent as PathOne } from "assets/svgs/background/Path100.svg"
import { ReactComponent as PathTwo } from "assets/svgs/background/Path101.svg"
import { ReactComponent as PathThree } from "assets/svgs/background/Path102.svg"
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <section>
            <div className="home-screen-container">
                <div className="background-container"><Background /></div>
                <div className="homehero">
                    <div className="homehero-title-container">
                        <h1 className="homehero-title">Datasektionen.link</h1>
                        <h2 className="homehero-subtitle">Stay organized with crowdsourcing</h2>
                    </div>
                    <div className="box-container">
                        <FirstFloatingBox className="box" />
                        <SecondFloatingBox className="box" />
                        <ThirdFloatingBox className="box" />
                    </div>
                </div>
                <div className="path-wrapper">
                    <div className="short-info-container">
                        <div className="info-container">
                            <h3>Collaborate</h3>
                            <Collaborate className="info-image" />
                            <p>Create a space together with everyone else in your program where all data is neatly organized</p>
                        </div>
                        <span className="info-container-vertical-separator" />
                        <div className="info-container">
                            <h3>Crowdsourced</h3>
                            <CrowdSource className="info-image" />
                            <p>Let anyone perform edits to your board. Fast accessibility leads to more contributions!</p>
                        </div>
                        <span className="info-container-vertical-separator" />
                        <div className="info-container">
                            <h3>Clear deadlines</h3>
                            <Deadline className="info-image" />
                            <p>All deadlines are easily accessible and sorted by urgency</p>
                        </div>
                    </div>
                    <div className="path-container">
                        <PathOne className="path-one path" />
                        <PathTwo className="path-two path" />
                        <PathThree className="path-three path" />
                    </div>
                </div>
                
                <div className="join-too">
                    <div className="join-too-content-container">
                        <h3>Join one of the crowdsourced programs</h3>
                        <div className="join-too-program-wrapper">
                            <Link to="/D20">
                                <div className="program-link">
                                    <p>D20</p>
                                </div>
                            </Link>
                            <Link to="/D21">
                                <div className="program-link">
                                    <p>D21</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="homepage-footer">
                <div>
                    <h2>Datasektionen.link</h2>
                </div>
                <div className="homepage-footer-column-container">
                    <div>
                        <h3>Development</h3>
                        <hr />
                        <p><a className="footer-link" href="https://github.com/Hampfh/DataLinks">Contribute to the project</a></p>
                        <p><a className="footer-link" href="https://github.com/Hampfh/DataLinks">View the source code</a></p>
                        <p><a className="footer-link" href="https://github.com/Hampfh/DataLinks/issues">Report a bug</a></p>
                    </div>
                    <div>
                        <h3>Reach out</h3>
                        <hr />
                        <p><a className="footer-link" href="https://datasektionen.se/">datasektionen.se</a></p>
                    </div>
                </div>
            </footer>
        </section>
    )
}
