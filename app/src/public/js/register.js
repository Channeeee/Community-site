"use strict";

const id = document.querySelector('#id'),
    psword = document.querySelector('#psword'),
    confirmPsword = document.querySelector('#Confirm-psword'),
    name = document.querySelector('#name'),
    registerBtn = document.querySelector("#button");

registerBtn.addEventListener("click", register);

function register(){
    if (!id.value) return alert("아이디를 입력해주십시오.");
    if (psword.value !== confirmPsword.value) {
        return alert("비밀번호가 일치하지 않습니다.")
    }
    const req = {
        id: id.value,
        psword: psword.value,
        name: name.value,
    };

    fetch("/register", {
        method: "Post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    })
    .then((res) => res.json())
    .then((res) =>{
        if (res.success) {
            location.href = "/";
        } else {
            if (res.err) return alert(res.err);
        alert(res.msg);
        }
    })
    .catch((err) => {
        console.error(new Error("회원가입 에러"))
    });
}
