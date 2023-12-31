`user script`;

// Main
function buildMedias(inputURL) {
    const q = inputURL.split("-");
    const offset = (parseInt(q[0]) - 1) * 20;
    let url = "https://m.douyu.com/hgapi/live/home/newRecList?offset="+offset+"&limit=20";
    if (q.length > 1) {
        url = "https://m.douyu.com/hgapi/live/cate/newRecList?offset="+offset+"&cate2="+q[1]+"&limit=20";
    }

    const req = {
        url: url,
        method: "GET",
    };

    $http.fetch(req).then(res => {
        const items =  JSON.parse(res.body).data.list;
        // print(items);
        var datas = [];
        items.forEach(item => {
            const title = item.roomName;
            const href = String(item.rid);
            const coverURLString = item.roomSrc;
            var descriptionText = item.tag;
            if (descriptionText == null||descriptionText ==""||descriptionText ==undefined) {
                descriptionText = item.hn;
            }
            datas.push(
                buildMediaData(href, coverURLString, title, descriptionText, href)
            );
        });
        $next.toMedias(JSON.stringify(datas));
    });
}

function Episodes(inputURL) {
    const rid = inputURL;
    const did = "10000000000000000000000000001501";
    const tt0 = Math.round(new Date().getTime()/1000).toString();
    let req = {
        url: "https://www.douyu.com/swf_api/homeH5Enc?rids="+rid,
        method: "GET",
    };

    $http.fetch(req).then(res => {
        const elementID = "room" + rid;
        const jsUb9Node =  JSON.parse(res.body).data[elementID];

        let jsUb9 = jsUb9Node.replace(/eval.*?;}/gi,'strc;}');
        eval(jsUb9);
        jsUb9 = ub98484234();
        const v = jsUb9.match(/v=(\d+)/)[1];
        //const m = '"' + hex_md5(rid + did + tt0 + v) + '"';
        const m = '"' + CryptoJS.MD5(rid + did + tt0 + v).toString() + '"';
        jsUb9 = 'function sign(' + jsUb9.match(/\(function \((.+)return rt;}/)[1] + 'return rt;}';
        jsUb9 = jsUb9.replace('CryptoJS.MD5(cb).toString()',m);
        eval(jsUb9);

        const params = sign(rid,did,tt0) + "&iar=0&ive=0&hevc=0&fa=0&cdn=tct-h5&rate=0";

        req = {
            url: "https://www.douyu.com/lapi/live/getH5Play/"+rid,
            method: "POST",
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };

        $http.fetch(req).then(res => {
            const content =  JSON.parse(res.body).data;
            playURL = content.rtmp_url + '/' + content.rtmp_live;
            //print(playURL);
            var datas = [];
            const href = playURL;
            const title = "原畫";
            datas.push(buildEpisodeData(href, title, href));
            $next.toEpisodes(JSON.stringify(datas));
        }); 
    });    
}

function Player(inputURL) {
    $next.toPlayer(inputURL);
}

function Search(inputURL) {
}