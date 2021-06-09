const mainscroll = () => {
    $(".main-scroll").css("height", $(window).height());
    $(window).bind("resize", function () {
        $(".main-scroll").css("height", $(window).height());
    });
}
export default mainscroll