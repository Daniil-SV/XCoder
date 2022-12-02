declare class Item {
    name: string;
    description: string;
    showTime: boolean;
    handler: Function;
    arguments: object;
    constructor(options: Partial<Item>);
    run(...args: any): void;
}
declare class Category {
    name: string;
    items: Item[];
    constructor(name: string);
}
declare class Menu {
    categories: Category[];
    constructor();
    printCategory(text: string): void;
    printFeature(id: number, name: string, description?: string, width?: number): void;
    printDividerLine(width: number): void;
    initialize(): void;
    choice(): Item;
}
export declare const menu: Menu;
export {};
