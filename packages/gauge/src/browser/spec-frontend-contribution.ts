import {inject, injectable} from "inversify"
import {
    Command,
    CommandContribution,
    CommandRegistry,
    MenuContribution,
    MenuModelRegistry,
    SelectionService,
} from '@theia/core/lib/common';
import {FrontendApplication, OpenerService, SingleTextInputDialog} from '@theia/core/lib/browser';
import { FileMenus } from '@theia/filesystem/lib/browser/filesystem-commands';
import {FileStat, FileSystem, UriSelection} from "@theia/filesystem/lib/common";
import URI from '@theia/core/lib/common/uri';
import {NAVIGATOR_CONTEXT_MENU, NEW_MENU_GROUP} from "@theia/navigator/lib/browser/navigator-menu";

export namespace SpecCommands {
    export const NEW: Command = {
        id: 'spec:new',
        label: 'New Spec'
    }
}

@injectable()
export class SpecFrontendContribution implements CommandContribution, MenuContribution {
    protected terminalNum = 0;

    constructor(@inject(FrontendApplication) protected readonly app: FrontendApplication,
                @inject(FileSystem) protected readonly fileSystem: FileSystem,
                @inject(SelectionService) protected readonly selectionService: SelectionService,
                @inject(OpenerService) protected readonly openerService: OpenerService) {
    }

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(FileMenus.NEW_GROUP, {
            commandId: SpecCommands.NEW.id
        });
        menus.registerMenuAction([NAVIGATOR_CONTEXT_MENU, NEW_MENU_GROUP], {
            commandId: SpecCommands.NEW.id
        });

    }

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(SpecCommands.NEW, {
            isEnabled: () => {
                const uri = UriSelection.getUri(this.selectionService.selection)
                if (uri && (uri.toString().endsWith("specs") || uri.toString().endsWith("specs/"))) {
                    return true;
                }
                return false;

            },
            execute: () => this.newSpecFile()
        });
    }

    private newSpecFile() {
        const uri = UriSelection.getUri(this.selectionService.selection)
        if (uri) {
            this.getDirectory(uri).then(parent => {
                const parentUri = new URI(parent.uri);
                const vacantChildUri = this.findVacantChildUri(parentUri, parent, 'Untitled', '.spec');
                const dialog = new SingleTextInputDialog({
                    title: `New Spec`,
                    initialValue: vacantChildUri.path.base,
                    validate: name => this.validateFileName(name, parent)
                })
                dialog.open().then(name => {
                    const fileUri = parentUri.resolve(name);
                    this.fileSystem.createFile(fileUri.toString()).then(() => {
                        this.fileSystem.getFileStat(fileUri.toString()).then( fileStat => {
                            const content = "Specification Heading\n" +
                                "=====================\n" +
                                "\n" +
                                "This is an executable specification file which follows markdown syntax.\n" +
                                "Every heading in this file denotes a scenario. Every bulleted point denotes a step.\n" +
                                "\n" +
                                "Scenario Heading\n" +
                                "----------------";
                            this.fileSystem.setContent(fileStat, content).then(() => {
                                this.openerService.getOpener(fileUri).then(o => {
                                    o.open(fileUri)
                                })
                            })
                        })
                    });
                })
            });
        }
    }

    protected validateFileName(name: string, parent: FileStat): string {
        if (!name || !name.match(/^([\w\-. ]+)(\.spec|\.md)$/)) {
            return "Invalid name, try other";
        }
        if (parent.children) {
            for (const child of parent.children) {
                if (new URI(child.uri).path.base === name) {
                    return 'A file with this name already exists.';
                }
            }
        }
        return '';
    }

    /**
     * returns an error message or an empty string if the file name is valid
     * @param name the simple file name to validate
     * @param parent the parent directory's file stat
     */
    protected async getDirectory(candidate: URI): Promise<FileStat> {
        const stat = await this.fileSystem.getFileStat(candidate.toString());
        if (stat.isDirectory) {
            return stat;
        }
        return this.getParent(candidate);
    }

    protected getParent(candidate: URI): Promise<FileStat> {
        return this.fileSystem.getFileStat(candidate.parent.toString());
    }

    protected findVacantChildUri(parentUri: URI, parent: FileStat, name: string, ext: string = ''): URI {
        const children = !parent.children ? [] : parent.children!.map(child => new URI(child.uri));

        let index = 1;
        let base = name + ext;
        while (children.some(child => child.path.base === base)) {
            index = index + 1;
            base = name + '_' + index + ext;
        }
        return parentUri.resolve(base);
    }
}
