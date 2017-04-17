"use strict";

var siteUtils = require("../site-utils"),
    logger = require("../logger")();

function SurugayaSite(uri) {

    // error check to make sure this is a valid uri for Surugaya
    if (!SurugayaSite.isSite(uri)) {
        throw new Error("invalid uri for Surugaya: " + uri);
    }

    this._uri = uri;

    this.getURIForPageData = function() {
        return this._uri;
    };

    this.isJSON = function() {
        return false;
    };

    this.findPriceOnPage = function($) {
        var selectors, price;

        // the various ways we can find the price on an Surugaya page
        selectors = [
            "#price .red"
        ];

        // find the price on the page
        price = siteUtils.findContentOnPage($, selectors);

        // were we successful?
        if (!price) {
            //logger.error($("body").text().trim());
            logger.error("price not found on surugaya page, uri: " + this._uri);
            return -1;
        }

        // process the price string
        price = siteUtils.processPrice(price);

        return price;
    };

    this.findCategoryOnPage = function($) {
        var category;

        category = $("#topicPath_itemdetail a").eq(1).text();
        console.log(category);
        if (!category || category.length < 1) {
            logger.error("category not found on Surugaya page, uri: " + this._uri);
            return null;
        }

        if (category === "CD") {
            category = siteUtils.categories.MUSIC;
        } else if (category === "ゲーム") {
            category = siteUtils.categories.VIDEO_GAMES;
        } else if (category === "書籍") {
            category = siteUtils.categories.BOOKS;
        } else if (category === "コミック") {
            category = siteUtils.categories.BOOKS;
        } else if (category === "ブルーレイ・DVD") {
            category = siteUtils.categories.MOVIES_TV;
        } else if (category === " おもちゃホビー") {
            category = siteUtils.categories.TOYS_GAMES;
        } else if (category === "AV機器") {
            category = siteUtils.categories.HOME_AUDIO;
        } else {
            logger.log("category not setup, using 'other'");
            category = siteUtils.categories.OTHER;
        }

        logger.log("category: " + category);

        return category;
    };

    this.findNameOnPage = function($, category) {
        var name, selectors;

        /*if (category === siteUtils.categories.DIGITAL_MUSIC) {
            name = $("#ArtistLinkSection").text().trim() + ": " +
                $("#title_feature_div").text().trim();
        } else */{
            selectors = [
                "#item_title"
            ];

            // use the selectors to find the name on the page
            name = siteUtils.findContentOnPage($, selectors);
        }

        if (!name) {
            logger.error("name not found on Surugaya page, uri: " + this._uri);
            return null;
        }

        logger.log("name: " + name);

        return name;
    };
}

SurugayaSite.isSite = function(uri) {
    if (uri.indexOf("www.suruga-ya.jp/") > -1) {
        return true;
    } else {
        return false;
    }
};

module.exports = SurugayaSite;
