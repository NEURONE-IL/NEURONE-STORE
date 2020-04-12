const path = require('path');
const fs = require('fs-extra');
const scrape = require('website-scraper');
const charset = require('charset');
//const iconv = require('iconv');
const cheerio = require('cheerio');


const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36';

const download = (docName, documentUrl, userId, callback) => {
    let downloadPath, queryPath;

    // if (isIndexable) {
    //     downloadPath = path.join(downloadDir, docName);
    //     queryPath = path.join(dirName, docName);
    // } else {
    fs.ensureDirSync(`./server/public/${userId}/preview`);
    downloadPath = path.join(__dirname, '..', 'public', userId, 'preview');
    queryPath = path.join(userId, 'preview');
    //}

    let options = {
        urls: [documentUrl],
        directory: downloadPath,
        filenameGenerator: 'bySiteStructure', //'byType',
        recursive: false,
        httpResponseHandler: (response) => {
            const htmlBody = response.headers['content-type'].startsWith('text/html') && response.body;
            const re = /((https?:\/\/)(\w+)(.disqus.com))/;
            if (htmlBody && re.test(htmlBody)) {
                const updatedHtmlBody = htmlBody.replace(re, '');
                return Promise.resolve(updatedHtmlBody);
            } else {
                return Promise.resolve(response.body);
            }
        },
        request: {
            headers: { 'User-Agent': userAgent }
        }
    }

    fs.remove(downloadPath, (err) => {
        if (!err) {
            //fs.ensureDirSync(`./server/uploads/${userId}/preview`);
            scrape(options, (err2, res2) => {
                //console.log(1);
                if (!err2) {
                    //console.log(2);
                    let response = {
                        docName: docName,
                        pageUrl: res2[0].url,
                        route: path.join(queryPath, res2[0].filename).replace(/\\/g, "/"),
                        fullPath: path.join(downloadPath, res2[0].filename)
                    };

                    //console.log(response);
                    callback(null, response);
                } else {
                    //console.log(3);
                    console.error('Error while downloading document', documentUrl, err2);
                    callback(err2);
                }
            });
        } else {
            //console.log(err);
            console.error('Error while deleting old document files', documentUrl, err);
            callback(err);
        }
    });
}


const preview = (docObj, userId, callback) => {
    //console.log('Attempting to preview document!');
    //console.log('Document URL', docObj.url);

    if(Object.entries(docObj).length === 0){
        callback({msg: 'ERROR'});
        return;
    }

    let document = {
        _id: '<preview>',
        docName: docObj.docName,
        title: docObj.title || 'New NEURONE Page',
        locale: docObj.locale || 'en',
        relevant: docObj.relevant || false,
        task: docObj.task || ['preview'],
        domain: docObj.domain || ['preview'],
        keywords: docObj.keywords || [],
        date: docObj.date,
        url: docObj.maskedUrl || docObj.url || '',
        searchSnippet: docObj.searchSnippet || '',
        indexedBody: ''
    };

    download(docObj.docName, docObj.url, userId, (err, res) => {
        if (!err) {
            document.route = res.route;
            cleanDocument(res.fullPath, document.url);
            //let docInfo = DocumentParser.getDocumentInfo(res.fullPath);

            //for (var attrname in docInfo) { if (Utils.isEmpty(document[attrname])) document[attrname] = docInfo[attrname]; }

            //console.log('Document downloaded for preview successfully!', docObj.url);
            //console.log(document);
            callback(null, document);
        } else {
            //console.log(err);
            callback({ msg: 'ERROR!' });
        }
    });
}

const readFile = (path) => {
    try {
        // dgacitua: http://stackoverflow.com/a/18711982
        var htmlBuffer = fs.readFileSync(path),
            htmlString = htmlBuffer.toString(),
            encoding = charset([], htmlString); // || jschardet.detect(htmlString).encoding.toLowerCase();

        if (encoding === 'utf-8' || encoding === 'utf8' || !encoding) {
            return htmlString;
        }// else {
        //     var ic = new iconv.Iconv(encoding, 'UTF-8//TRANSLIT//IGNORE'),
        //         buf = ic.convert(htmlBuffer),
        //         str = buf.toString('utf-8');

        //     return str;
        // }
    } catch (e) {
        console.error(e);
        return '';
    }
}

const cleanDocument = (documentPath, originUrl) => {
    try {
        let relPath = documentPath,
            fileDir = path.dirname(relPath),
            fileExt = path.extname(relPath),
            fileName = path.basename(relPath, fileExt),
            newFilename = fileName + fileExt;
        //pageDomain = this.getDomainUrl(originUrl);

        let htmlFile = readFile(relPath),
            htmlString = htmlFile.toString(),
            $ = cheerio.load(htmlFile);

        const parseClass = (classValue) => { return classValue.split(' ') };


        // dgacitua: Remove onclick attribute from anchor tags
        $('a').each((i, elem) => {
            $(elem).removeAttr('onclick');
        });

        // dgacitua: Remove all external links
        $('a[href]').each((i, elem) => {
            $(elem).attr('href', 'javascript:void(0)');
            $(elem).removeAttr('target');
        });

        // dgacitua: Remove all iframes and frames
        $('iframe,frame').each((i, elem) => {
            $(elem).remove();
        });

        // dgacitua: Remove javascript
        $('script').each((i, elem) => {
            $(elem).remove();
        });

        // dgacitua: Remove onclick attribute from all tags
        $('[onclick]').each((i, elem) => {
            $(elem).removeAttr('onclick');
        });

        // dgacitua: Disable input elements
        $('input').each((i, elem) => {
            $(elem).removeAttr('id');
            $(elem).attr('disabled', 'true');
        });

        // dgacitua: Disable button elements
        $('button').each((i, elem) => {
            $(elem).removeAttr('id');
            $(elem).attr('disabled', 'true');
        });

        // dgacitua: Disable submit
        $('[type="submit"]').each((i, elem) => {
            $(elem).removeAttr('type');
        });

        // dgacitua: Disable form action
        $('form').each((i, elem) => {
            $(elem).removeAttr('action');
            $(elem).removeAttr('method');
        });

        var cleanedHtml = $.html();

        fs.writeFileSync(path.join(fileDir, newFilename), cleanedHtml);

        return true;

    } catch (e) {
        console.error(e);
        return false;
    }
}

module.exports = { preview };