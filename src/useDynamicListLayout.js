import { useState, useEffect } from 'react';

const useDynamicListLayout =
    ({
        getItemHeight,
        getSeparatorHeight = () => 0,
        getSectionHeaderHeight = () => 0,
        getSectionFooterHeight = () => 0,
        listHeaderHeight = 0,
    }) =>
        (data, index) => {
            const [length, setLength] = useState(0);
            const [offset, setOffset] = useState(
                typeof listHeaderHeight === 'function'
                    ? listHeaderHeight()
                    : listHeaderHeight,
            );
            const [sectionIndex, setSectionIndex] = useState(0);
            const [elementPointer, setElementPointer] = useState({
                type: 'SECTION_HEADER',
            });

            useEffect(() => {
                let i = 0;

                while (i < index) {
                    switch (elementPointer.type) {
                        case 'SECTION_HEADER': {
                            const sectionData = data[sectionIndex].data;

                            setOffset(
                                prevOffset => prevOffset + getSectionHeaderHeight(sectionIndex),
                            );

                            if (sectionData.length === 0) {
                                setElementPointer({ type: 'SECTION_FOOTER' });
                            } else {
                                setElementPointer({ type: 'ROW', index: 0 });
                            }

                            break;
                        }
                        case 'ROW': {
                            const sectionData = data[sectionIndex].data;
                            const rowIndex = elementPointer.index;

                            setOffset(
                                prevOffset =>
                                    prevOffset +
                                    getItemHeight(sectionData[rowIndex], sectionIndex, rowIndex),
                            );
                            setElementPointer(prevElementPointer => ({
                                ...prevElementPointer,
                                index: prevElementPointer.index + 1,
                            }));

                            if (rowIndex === sectionData.length - 1) {
                                setElementPointer({ type: 'SECTION_FOOTER' });
                            } else {
                                setOffset(
                                    prevOffset =>
                                        prevOffset + getSeparatorHeight(sectionIndex, rowIndex),
                                );
                            }

                            break;
                        }
                        case 'SECTION_FOOTER': {
                            setOffset(
                                prevOffset => prevOffset + getSectionFooterHeight(sectionIndex),
                            );
                            setSectionIndex(prevSectionIndex => prevSectionIndex + 1);
                            setElementPointer({ type: 'SECTION_HEADER' });
                            break;
                        }
                    }

                    i += 1;
                }

                let currentLength;
                switch (elementPointer.type) {
                    case 'SECTION_HEADER':
                        currentLength = getSectionHeaderHeight(sectionIndex);
                        break;
                    case 'ROW':
                        const rowIndex = elementPointer.index;
                        currentLength = getItemHeight(
                            data[sectionIndex].data[rowIndex],
                            sectionIndex,
                            rowIndex,
                        );
                        break;
                    case 'SECTION_FOOTER':
                        currentLength = getSectionFooterHeight(sectionIndex);
                        break;
                    default:
                        throw new Error('Unknown elementPointer.type');
                }

                setLength(currentLength);
            }, [
                index,
                elementPointer,
                data,
                getItemHeight,
                getSeparatorHeight,
                getSectionHeaderHeight,
                getSectionFooterHeight,
            ]);

            return { length, offset, index };
        };

export default useDynamicListLayout;
