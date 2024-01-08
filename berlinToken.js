export function checkTokenAndRedirect(token) {
    const loginToken = getCookie('berlinToken');
    if (!loginToken) {
        window.location.href = './index.html';
    }
}

export function getCookie(name) {
   
}