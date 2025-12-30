import { registerBlockType } from '@wordpress/blocks';
import metadata from '../block.json';

import Edit from './edit';
import save from './save';

import './style.scss';
import './editor.scss';

// include frontend js
import './view.js';

registerBlockType(metadata.name, {
    edit: Edit,
    save,
});
