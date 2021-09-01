import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { SubjectData } from '../Subjects/Subjects'
import "./Archive.css"
import logoutIcon from "assets/icons/close.svg"
import { DataLoader } from 'functions/DataLoader'

export default function Archive(props: PropsForComponent) {
    const [search, setSearch] = useState<string>()

    function matchesSearch(subject: SubjectData) {
        if (search == null)
            return true

        const code = subject.code.toLowerCase()
        const name = subject.name.toLowerCase()

        // ! This is a very "dumb" search algorithm, please improve it
        for (let i = 0; i < search.length; i++) {
            if (search[i] !== code[i] && search[i] !== name[i]) {
                return false
            }
        }
        return true
    }

    async function onSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.value.length <= 0) {
            setSearch(undefined)
            return
        }
        setSearch(event.target.value.toLowerCase())
    }

    return (
        <div className="pageWrapper">
            <div className="archiveContainer">
                <div className="exitButtonContainer">
                    <Link to={`/${DataLoader.getActiveProgram()?.name ?? 404}`}>
                        <div className="archiveLogoutIconBackground">
                            <img className="archiveLogoutIcon" alt="Exit view" src={logoutIcon} />
                        </div>
                    </Link>
                </div>
                <h1>Course archive</h1>
                <h3>Here are all completed courses for {DataLoader.getActiveProgram()?.name ?? "the data program"}</h3>
                <div>
                    <input className="searchInput" placeholder="Search course code" onChange={onSearchChange}/>
                </div>
                <div className={"courseList"}>
                    {props.subjects.map(current => {
                        if (!matchesSearch(current) || !current.archived) {
                            return null
                        }
                        return (
                            <div key={current.code}>
                                <Link to={`/${DataLoader.getActiveProgram()?.name ?? 404}/course/${current.code}`} className="archivedLink">
                                    <div className="archivedItem">
                                        <p className="archivedItemCode">{current.code}</p>
                                        <p className="archivedItemName">{current.name}</p>
                                    </div>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

interface PropsForComponent {
    subjects: Array<SubjectData>
}