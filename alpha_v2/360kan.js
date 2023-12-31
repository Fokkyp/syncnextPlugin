`user script`;

// Utils
const filterAPI = 'https://api.web.360kan.com/v1/filter/list?';
const searchAPI = "https://api.so.360kan.com/index?"
const detailAPI = "https://api.web.360kan.com/v1/detail?"

const headers = {
    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.82',
    'Referer':'https://video.360kan.com',
}
// Main
function buildMedias(inputURL) {
    const q = inputURL.split("-");
    const url = filterAPI + 'catid=' + q[0] + '&rank=ranklatest&cat=&year=&area=&act=&size=20&pageno=' + q[1];
    //print(url);

    const req = {
        url: url,
        method: "GET",
        headers: headers
    };

    $http.fetch(req).then(res => {
        const items =  JSON.parse(res.body).data.movies;
        //print(items);
        let datas = [];
        items.forEach(item => {
            const title = item.title;
            const href = q[0] + '-' + String(item.id);
            const coverURLString = 'http:' + item.cdncover;
            let descriptionText = item.tag;
            if (descriptionText == null||descriptionText ==""||descriptionText ==undefined) {
                descriptionText = item.comment;
            }
            datas.push(
                buildMediaData(href, coverURLString, title, descriptionText, href)
            );
        });
        $next.toMedias(JSON.stringify(datas));
    });
}

function Episodes(inputURL) {
    const q = inputURL.split("-");
    const url = detailAPI + 'cat=' + q[0] + '&id=' + q[1]
    const req = {
        url: url,
        method: "GET",
        headers: headers
    };

    $http.fetch(req).then(res => {
        //print(res.body);
        const jsonData = JSON.parse(res.body).data;
        const sites = ['qq','qiyi','youku','imgo','leshi'];

        let items = [];
        let datas = [];
        if (q[0] == "1"){
            for (let index = 0; index < sites.length; index++) {
                let item = jsonData.playlinksdetail[sites[index]];
                if (item !=undefined && item != null){
                    const href = item.default_url;
                    const title = jsonData.title;
                    datas.push(buildEpisodeData(href, title, href));
                    break;
                }
            }
        }

        if (q[0] == "2" || q[0] == "4"){
            for (let index = 0; index < sites.length; index++) {
                items = jsonData.allepidetail[sites[index]];
                if (items !=undefined && items != null){
                    break;
                }
            }
            
            items.forEach(item => {
                const href = item.url;
                const title = item.playlink_num;
                datas.push(buildEpisodeData(href, title, href));
            });
        }

        if (q[0] == "3"){
            items = jsonData.defaultepisode
            
            items.forEach(item => {
                const href = item.url;
                const title = item.name;
                datas.push(buildEpisodeData(href, title, href));
            });
        }
        
        $next.toEpisodes(JSON.stringify(datas));
    });
}

function Player(inputURL) {
    //播放部分暫時調用第三方解析(無法播放)，後續補充直接解析代碼
    parser_player(inputURL);
}

function Search(inputURL) {
}