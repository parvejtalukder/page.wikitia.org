// import React from 'react';

const Table = () => {
    return (
        <div className="w-sm lg:w-md lg:px-0 px-4">
            <div className="border-t border-gray-200">
                <div className="flex justify-between items-center py-5 border-b border-gray-200">
                    <span className="text-gray-500">Knowledge panel</span>
                    <span className="text-[#555] font-bold text-right">For some pages</span>
                </div>
                <div className="flex justify-between items-center py-5 border-b border-gray-200">
                    <span className="text-gray-500">Featured Snippets</span>
                    <span className="text-[#555] font-bold text-right">For several pages and keywords</span>
                </div>
                <div className="flex justify-between items-center py-12 border-b border-gray-200">
                    <span className="text-gray-500">Rich results</span>
                    <span className="text-[#555] font-bold text-right">For most of the pages</span>
                </div>                
                <div className="flex justify-between items-center py-12 border-b border-gray-200">
                    <span className="text-gray-500">Top search results</span>
                    <span className="text-[#555] font-bold text-right">For nearly all pages</span>
                </div>

            </div>
        </div>

    );
};

export default Table;