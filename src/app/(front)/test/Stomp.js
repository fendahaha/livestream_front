'use client'
import {Client} from '@stomp/stompjs';
import {useEffect, useRef} from "react";
import {Button, Input, Space} from "antd";

export default function Stomp() {

    useEffect(() => {
        // console.log(Client);
        let destination = '/topic/a';
        let msg = 'hello';
        let client = new Client({
            brokerURL: 'ws://localhost:8080/portfolio?token=df12sda&username=fenda1',
            connectHeaders: {
                login: 'user',
                passcode: 'password',
                username: 'fenda1',
            },
            debug: function (str) {
                console.log("debug:", str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });
        client.onConnect = function (frame) {
            console.log(JSON.stringify(frame));

        };

        setTimeout(() => {
            client.activate();
            client.subscribe(destination, (message) => {
                if (message.body) {
                    alert('got message with body ' + message.body);
                } else {
                    alert('got empty message');
                }
            });
            client.publish({destination: destination, body: msg, headers: {priority: '9'}});
        }, 1000 * 2)

        // return () => {
        //     client.deactivate();
        // }
    }, []);
    return (
        <div>
            <div className={'d1'}></div>
            <style jsx>{`
              .d1 {
                width: 100%;
                height: 300px;
                border: 1px solid red;
              }
            `}</style>
        </div>
    );
}