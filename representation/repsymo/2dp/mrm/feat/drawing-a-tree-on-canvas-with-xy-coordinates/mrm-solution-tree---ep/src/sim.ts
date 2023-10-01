// Copyright (c) 2023 Tobias Briones. All rights reserved.
// SPDX-License-Identifier: GPL-3.0-or-later
// This file is part of https://github.com/repsymo/2dp-repsymo-solver

export interface Caption {
    abstract?: string;
    title: string;
    subHome?: string;
    home: string;
}

export interface Shot {
    screenshot: string;
    caption: Caption;
}

function getShot(canvasEl: HTMLCanvasElement, caption: Caption): Shot {
    return {
        // screenshot: '',
        screenshot: canvasEl.toDataURL('image/png'),
        caption
    };
}

export class Screenshots {
    private readonly canvas: HTMLCanvasElement;
    readonly shots: Shot[];

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.shots = [];
    }

    save(abstract: string) {
        this.shots.push(getShot(
                this.canvas,
                {
                    title: 'Rendering Order',
                    home: 'mathsoftware.engineer',
                    subHome: 'Drawing a Tree on Canvas with XY Coordinates',
                    abstract
                }
            )
        );
    }

    saveLast() {
        const last = getShot(
            this.canvas,
            {
                title: 'Rendering Order',
                subHome: 'Drawing a Tree on Canvas with XY Coordinates',
                home: 'mathsoftware.engineer'
            }
        );

        this.shots.push(last);
        this.shots.push(last);
        this.shots.push(last);
        this.shots.push(last);
    }

    download() {
        const combinedText = JSON.stringify(this.shots);
        const blob = new Blob([combinedText], {type: 'text/plain'});
        const a = document.createElement('a');

        console.log(`Downloading ${this.shots.length} screenshots`);
        a.href = URL.createObjectURL(blob);
        a.download = 'sim.json';
        a.click();
        URL.revokeObjectURL(a.href);
    }
}
