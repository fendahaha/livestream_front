'use client'
import Link from "next/link";
import {useSearchParams} from "next/navigation";

export default function Component() {
    const readonlyURLSearchParams = useSearchParams();
    return (
        <div>
            admin
            <p><Link href={'/admin?a=1'}>asdasdasd</Link></p>
            <span>{readonlyURLSearchParams.size}</span>
        </div>
    );
}