"use strict"; module.exports = {
    open_panel: "Optional build",
    description: "ROCKET PLAYABLE BUILD TOOL FOR COCOS 3.6.0",
    welcome: "Các bước sau để build MintegralNetwork với IronSourceNetWork & UnityNetWork chỉ cần ấn build",
    step_1: "P1: Tạo biến bool mindworks = false",
    step_2: "P2: Thêm dòng sau vào hàm Start() ==> if (this.mindworks){window.gameReady && window.gameReady(); ",
    step_3: "P3: Thêm hàm này vào dưới cùng của scripts ==> EventNetWork() {if (this.mindworks) {window.gameEnd && window.gameEnd();}if (this.vungle) {parent.postMessage('complete', '*');} ",
    step_4: "P4: Nếu muốn build Mintengral thì bật true biến mindworks ở trên lên rồi bấm build lại, rồi đóng zip ",

    supportAds: "Hỗ trợ build: [IronSource] [Mintengral] [Unity]",
    canbuildAds: "Đang phát triển: [Facebook] [Google] [Liftoff] [Moloco] [Pangle] [Rubeex] [Tiktok] [AppLovin] [Vungle]",

    behavior:"STATUS: ",
    get_help: "ROCKET STUDIO",
    cancel: "Cancel (X)",
    pack: "Build (V)",
};