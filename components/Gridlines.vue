<template>
    <div class="lines-grid">
        <div id="item-0" class="border border-l-0 border-black dark:border-white">&nbsp;</div>
        <div id="item-1" class="border border-l-0 border-black dark:border-white">&nbsp;</div>
        <div id="item-2" class="border border-l-0 border-black dark:border-white">&nbsp;</div>
        <div id="item-3" class="border border-l-0 border-black dark:border-white">&nbsp;</div>
        <div id="item-4" class="border border-l-0 border-black dark:border-white">&nbsp;</div>
        <div id="item-5" class="border border-l-0 border-black dark:border-white">&nbsp;</div>
        <div id="item-6" class="border border-l-0 border-black dark:border-white">&nbsp;</div>
        <div id="item-7" class="border border-l-0 border-black dark:border-white">&nbsp;</div>
        <div id="item-8" class="border border-l-0 border-black dark:border-white">&nbsp;</div>
    </div>
</template>
<style>
.lines-grid {
    display: grid;

    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;

    gap: 0px;
    height: 100%;
    grid-auto-flow: dense;
}

#item-0 {

    grid-row-start: 1;
    grid-column-start: 1;

    grid-row-end: 2;
    grid-column-end: 3;

}

#item-1 {

    grid-row-start: 2;
    grid-column-start: 1;

    grid-row-end: 3;
    grid-column-end: 2;

}

#item-2 {

    grid-row-start: 2;
    grid-column-start: 2;

    grid-row-end: 3;
    grid-column-end: 4;

}

#item-3 {

    grid-row-start: 2;
    grid-column-start: 4;

    grid-row-end: 4;
    grid-column-end: 5;

}

#item-4 {

    grid-row-start: 3;
    grid-column-start: 2;

    grid-row-end: 5;
    grid-column-end: 3;

}

#item-5 {

    grid-row-start: 4;
    grid-column-start: 3;

    grid-row-end: 6;
    grid-column-end: 4;

}

#item-6 {

    grid-row-start: 5;
    grid-column-start: 1;

    grid-row-end: 6;
    grid-column-end: 3;

}

#item-7 {

    grid-row-start: 1;
    grid-column-start: 5;

    grid-row-end: 3;
    grid-column-end: 6;

}

#item-8 {

    grid-row-start: 4;
    grid-column-start: 5;

    grid-row-end: 6;
    grid-column-end: 6;

}</style>
