// import React from 'react';

const Table = () => {
    return (
        <div className="w-md">
            <div class="border-t border-gray-200">
                <div class="flex justify-between items-center py-5 border-b border-gray-200">
                    <span class="text-gray-500">Knowledge panel</span>
                    <span class="text-[#555] font-bold text-right">For some pages</span>
                </div>
                <div class="flex justify-between items-center py-5 border-b border-gray-200">
                    <span class="text-gray-500">Featured Snippets</span>
                    <span class="text-[#555] font-bold text-right">For several pages and keywords</span>
                </div>
                <div class="flex justify-between items-center py-12 border-b border-gray-200">
                    <span class="text-gray-500">Rich results</span>
                    <span class="text-[#555] font-bold text-right">For most of the pages</span>
                </div>                
                <div class="flex justify-between items-center py-12 border-b border-gray-200">
                    <span class="text-gray-500">Top search results</span>
                    <span class="text-[#555] font-bold text-right">For nearly all pages</span>
                </div>

            </div>
        </div>

    );
};

export default Table;