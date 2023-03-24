import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import React, {useEffect, useState} from "react";
import {Table} from "react-bootstrap";
import classes from "./Tab.module.scss"
import {GetUserFullName} from "../../api";


export function TabContainer({technicalText, descriptionText, commentText}) {
    const [comment, setComment] = useState([...commentText])

    useEffect(()=>{
        (async function assignUserToComment(){
            const newComment=[...comment]
            for (let i = 0; i < comment.length; i++) {
                newComment[i].name=await GetUserFullName(comment[i].id)
            }
            setComment(newComment)
        })()
    },[])

    return (
        <Tabs
            defaultActiveKey="technical"
            id="justify-tab-example"
            className="mb-3 myTab"
            justify
        >
            <Tab eventKey="technical" title="مشخصات فنی">
                <Table striped bordered hover>
                    <tbody>
                    {technicalText.map((item,index) => {
                        return (
                            <tr key={index}>
                                <td>{item["name-fa"]}</td>
                                <td>{item.value}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
            </Tab>
            <Tab eventKey="description" title="توضیحات">
                <div>
                    <div dangerouslySetInnerHTML={{__html: descriptionText}}/>
                </div>
            </Tab>
            <Tab eventKey="comment" title="نظرات">
                {comment.length>0 && comment.map((item,index) => {
                    return (
                        <div key={index} className={classes.comments}>
                            <h3>{item.name}</h3>
                            <p>{item.comment}</p>
                        </div>
                    )
                })}

            </Tab>
        </Tabs>
    );
}

