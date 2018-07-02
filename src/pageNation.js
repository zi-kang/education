const PageNation = (function () {
    function PageNation() {
    }
    PageNation.pageList = function(currentPage, totalPage){
        var pages = {
            preEll: true,
            lastEll: true,
            pageList: []
        };
        if (totalPage < 6) {
            pages.preEll = false;
            pages.lastEll = false;
            for (let i = 1; i <= totalPage; i++) {
                pages.pageList.push(i)
            }
        } else if (currentPage < 6) {
            pages.preEll = false;
            pages.lastEll = true;
            pages.pageList = [1, 2, 3, 4, 5]
        } else if (currentPage + 4 > totalPage) {
            pages.preEll = true;
            pages.lastEll = false;
            for(let i = totalPage - 4; i <=  totalPage; i++) {
                pages.pageList.push(i)
            }
        } else {
            pages.preEll = true;
            pages.lastEll = true;
            for(let i = currentPage - 2; i <=  currentPage + 2; i++) {
                pages.pageList.push(i)
            }
        }


        return pages
    }
    PageNation.selectPage = function (selectedPage, currentPage, totalPage) {
        var pages = 0;
        if(selectedPage < 1 || selectedPage > totalPage || selectedPage === currentPage) {
            pages = 0;
        }else {
            pages = selectedPage;
        }
        return pages
    }

    return PageNation;
}());
exports.PageNation = PageNation;