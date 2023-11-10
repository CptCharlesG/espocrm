/************************************************************************
 * This file is part of EspoCRM.
 *
 * EspoCRM - Open Source CRM application.
 * Copyright (C) 2014-2023 Yurii Kuznietsov, Taras Machyshyn, Oleksii Avramenko
 * Website: https://www.espocrm.com
 *
 * EspoCRM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * EspoCRM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EspoCRM. If not, see http://www.gnu.org/licenses/.
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "EspoCRM" word.
 ************************************************************************/

const BuildUtils = {
    /**
     * @param {Array} libs
     * @return {{src: string, file: string}[]}
     */
    getBundleLibList: function(libs) {
        const list = [];

        const getFile = item => {
            if (item.amdId) {
                return item.amdId + '.js';
            }

            return item.src.split('/').slice(-1);
        };

        libs.filter(item => item.bundle)
            .forEach(item => {
                if (item.files) {
                    item.files.forEach(item => list.push({
                        src: item.src,
                        file: getFile(item),
                    }));

                    return;
                }

                if (!item.src) {
                    return;
                }

                list.push({
                    src: item.src,
                    file: getFile(item),
                });
            });

        return list;
    },

    getPreparedBundleLibList: function (libs) {
        return BuildUtils.getBundleLibList(libs)
            .map(item => 'client/lib/original/' + item.file);
    },

    destToOriginalDest: function (dest) {
        const path = dest.split('/');

        return path.slice(0, -1)
            .concat('original')
            .concat(path.slice(-1))
            .join('/');
    },

    /**
     * @param {Object[]} libs
     * @return {{
     *   src: string,
     *   dest: string,
     *   originalDest: string|null,
     *   minify: boolean,
     * }[]}
     */
    getCopyLibDataList: function (libs) {
        const list = [];

        /**
         * @param {Object} item
         * @return {string}
         */
        const getItemDest = item => item.dest || 'client/lib/' + item.src.split('/').pop();

        /**
         * @param {Object} item
         * @return {string}
         */
        const getItemOriginalDest = item => {
            return BuildUtils.destToOriginalDest(
                getItemDest(item)
            );
        };

        libs.forEach(item => {
            if (item.bundle) {
                return;
            }

            const minify = !!item.minify;

            if (item.files) {
                item.files.forEach(item => {
                    list.push({
                        src: item.src,
                        dest: getItemDest(item),
                        originalDest: minify ? getItemOriginalDest(item) : null,
                        minify: minify,
                    });
                });

                return;
            }

            if (!item.src) {
                return;
            }

            list.push({
                src: item.src,
                dest: getItemDest(item),
                originalDest: minify ? getItemOriginalDest(item) : null,
                minify: minify,
            });
        });

        return list;
    },

    camelCaseToHyphen: function (string) {
        return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    },
}

module.exports = BuildUtils;
