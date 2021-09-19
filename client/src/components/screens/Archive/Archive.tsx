import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SubjectData } from '../Subjects/Subjects'
import "./Archive.css"
import logoutIcon from "assets/icons/close.svg"
import { DataLoader } from 'functions/DataLoader'
import DefaultHeader from 'components/templates/headers/DefaultHeader'

export default function Archive(props: PropsForComponent) {
    const [search, setSearch] = useState<string>()
    const { program } = useParams<IRouterParams>()

    useEffect(() => {
        DataLoader.manageProgramContentData(program)
    }, [program])

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
        <>
            <DefaultHeader menuSelect={2} pagePresenter="Archives" />
            <div className="pageWrapper">
                <div className="archiveContainer">
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
        </>
    )
}

interface PropsForComponent {
    subjects: Array<SubjectData>
}