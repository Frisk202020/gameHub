export function vhToPx(vh){
    return vh * document.documentElement.clientHeight/100;
}

export function pxToVh(px) {
    return 100 * px / document.documentElement.clientHeight;
}

export function vwToPx(vw){
    return vw * document.documentElement.clientWidth/100;
}

export function pxToVw(px) {
    return 100 * px / document.documentElement.clientWidth;
}

export const filePathRoot = "get_file/naval/assets/";