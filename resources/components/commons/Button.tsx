import * as React from "react";

function Button(props: React.HTMLAttributes<HTMLButtonElement>) {
    return (
        <button type="button" {...props}/>
    );
}

export default Button;