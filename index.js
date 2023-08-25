/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-08-25 18:06:23
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-08-25 18:06:28
 * @FilePath: /bugkiller/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// ==UserScript==
// @name         bug killer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  好好工作，早点下班!
// @author       libra
// @match        http://10.1.4.57/zentao/my-work-bug.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_info
// ==/UserScript==

(function () {
    'use strict';

    var bugKillerV2 = function (skipIds) {
        var confirmedBtns = document.querySelectorAll('.icon-bug-confirmBug.disabled.icon-ok[title="确认"]');
        var confirmedTrs = Array.from(confirmedBtns).map(function (btn) { return btn.closest('tr'); });
        // 跳过指定的bug
        if (skipIds?.length || 0 > 0) {
            confirmedTrs = confirmedTrs.filter(function (tr) {
                var checkobx = tr.querySelector('input[name="bugIDList[]"]');
                var id = checkobx.value;
                return !skipIds.includes(id);
            });
        }
        // 打开弹窗
        var resolveBtn = confirmedTrs[0].querySelector('[title="解决"]');
        resolveBtn === null || resolveBtn === void 0 ? void 0 : resolveBtn.click();
        var resolveIframe = document.querySelector('#iframe-triggerModal');
        var resolveWindow = resolveIframe === null || resolveIframe === void 0 ? void 0 : resolveIframe.contentWindow;
        resolveWindow === null || resolveWindow === void 0 ? void 0 : resolveWindow.addEventListener('load', function () {
            var resolveDocument = resolveWindow.document;
            // 清除上一次留存的dom
            const fadeInMasks = resolveDocument.querySelectorAll('.modal-backdrop.fade.in')
            const loadingMasks = resolveDocument.querySelectorAll('.modal-loading')
            const fadeInMasksInMask = resolveDocument.querySelectorAll('.modal modal-trigger.fade.modal-loading.modal-scroll-inside.modal-iframe.in')
            fadeInMasks.forEach(dom => dom?.remove())
            loadingMasks.forEach(dom => dom?.remove())
            fadeInMasksInMask.forEach(dom => dom?.remove())
            var changeEvent = new Event('change');
            // 选中解决方案为已解决
            var revolustionSelect = resolveDocument.querySelector('#resolution');
            var optionFixed = revolustionSelect.querySelector('option[value="fixed"]');
            optionFixed.selected = true;
            revolustionSelect.dispatchEvent(changeEvent);
            // 解决版本为最新一期
            var revolustionVersionSelect = resolveDocument.querySelector('#resolvedBuild');
            var optionVersions = revolustionVersionSelect === null || revolustionVersionSelect === void 0 ? void 0 : revolustionVersionSelect.querySelectorAll('option');
            var newestOptionVersion = optionVersions[optionVersions.length - 1];
            newestOptionVersion.selected = true;
            revolustionVersionSelect === null || revolustionVersionSelect === void 0 ? void 0 : revolustionVersionSelect.dispatchEvent(changeEvent);
            var saveBtn = resolveDocument.querySelector('#submit');
            saveBtn === null || saveBtn === void 0 ? void 0 : saveBtn.click();
            // 重复执行
            var trigerModal = document.querySelector('#triggerModal');
            var observer = new MutationObserver(function (mutations, observer) {
                mutations.forEach(function (mutation, index) {
                    var _a;
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        var isDisplay = ((_a = trigerModal === null || trigerModal === void 0 ? void 0 : trigerModal.style) === null || _a === void 0 ? void 0 : _a.display) === 'block';
                        if (!isDisplay) {
                            if (confirmedTrs.length === 1) {
                                observer.disconnect();
                            }
                            else if (index === 0) {
                                bugKillerV2(skipIds)
                            }
                        }
                    }
                });
            });
            observer.observe(trigerModal, {
                attributes: true,
                childList: true,
                subtree: true
            });
        });
    };
    var insertKillerBtn = function () {
        var actionBox = document.querySelector('.c-actions-5');
        var killerBtn = document.createElement('button');
        actionBox.appendChild(killerBtn);
        killerBtn.innerHTML = 'Bug Killer';
        killerBtn.addEventListener('click', function () {
            insertController();
            // 在window对象上添加 beforeunload 事件监听器
            window.addEventListener('beforeunload', function (event) {
                // 取消默认行为，弹出自定义的对话框
                event.preventDefault();
                event.returnValue = ''; // 兼容性写法
                return '请点击继续！？';
            });
        });
    };
    var insertController = function () {
        var bugKillerV2Controller = document === null || document === void 0 ? void 0 : document.createElement('div');
        var confirmedBtns = document.querySelectorAll('.icon-bug-confirmBug.disabled.icon-ok[title="确认"]');
        var confirmedTrs = Array.from(confirmedBtns).map(function (btn) { return btn.closest('tr'); });
        var isNoBug = confirmedTrs.length === 0;
        bugKillerV2Controller.setAttribute('id', 'bugKillerV2Controller');
        bugKillerV2Controller.setAttribute('style', 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; ');
        // bugKillerV2Controller.setAttribute('style', 'position: fixed; top: 0; left: 0; z-index: 9999; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5);')
        bugKillerV2Controller.innerHTML = "\n<div style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 300px; height: 300px; background-color: #fff; border-radius: 10px; padding: 20px;\">\n            <div style=\"margin-bottom: 20px;\">\n                <label for=\"skipIds\">\u8DF3\u8FC7\u7684bug id</label>\n                <input type=\"text\" id=\"skipIds\" placeholder=\"\u591A\u4E2Aid\u7528\u82F1\u6587\u9017\u53F7\u9694\u5F00\" style=\"width: 100%; height: 30px; border: 1px solid #ccc; border-radius: 5px; padding: 0 10px;\"> \n            </div>\n            ".concat(isNoBug ? '<span style="color:red">没有待点击的bug</span>' : '', "\n            <div style=\"text-align: center;\">\n                <button id=\"startBugKillerV2Start\" style=\"width: 100px; height: 30px; border: 1px solid #ccc; border-radius: 5px; background-color: #fff;").concat(isNoBug && 'pointer-event:none; color:gray;', "\">\u5F00\u59CB</button>\n                <button id=\"startBugKillerV2Cancel\" style=\"width: 100px; height: 30px; border: 1px solid #ccc; border-radius: 5px; background-color: #fff;\">\u53D6\u6D88</button>\n            </div>\n        </div>\n    ");
        var mainContent = document.querySelector('#mainContent');
        mainContent.append(bugKillerV2Controller);
        var startBtn = bugKillerV2Controller === null || bugKillerV2Controller === void 0 ? void 0 : bugKillerV2Controller.querySelector('#startBugKillerV2Start');
        var cancelBtn = bugKillerV2Controller === null || bugKillerV2Controller === void 0 ? void 0 : bugKillerV2Controller.querySelector('#startBugKillerV2Cancel');
        startBtn === null || startBtn === void 0 ? void 0 : startBtn.addEventListener('click', function () {
            var skipIdsInput = bugKillerV2Controller === null || bugKillerV2Controller === void 0 ? void 0 : bugKillerV2Controller.querySelector('#skipIds');
            var skipIds = skipIdsInput.value.split(',');
            bugKillerV2Controller === null || bugKillerV2Controller === void 0 ? void 0 : bugKillerV2Controller.remove();
            bugKillerV2(skipIds);
        });
        cancelBtn === null || cancelBtn === void 0 ? void 0 : cancelBtn.addEventListener('click', function () {
            bugKillerV2Controller === null || bugKillerV2Controller === void 0 ? void 0 : bugKillerV2Controller.remove();
        });
    };
    window.onload = function () {
        insertKillerBtn();
        // insertController();
    };
    // Your code here...
})();