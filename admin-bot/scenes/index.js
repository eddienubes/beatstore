const {
    editTitleScene,
    editTagsScene,
    editSTEMSUrlScene,
    editWavUrlScene,
    editScaleScene,
    editPreviewAudioScene,
    editMP3UrlScene,
    editImageScene,
    editBPMScene,
    editMoodsScene,
    editGenresScene
} = require('./edit-beat');

const {
    beatDeletionConfirmationScene
} = require('./delete-beat');

const {
    createNewBeatScene
} = require('./create-new-beat');

const {
    editLicensePrice,
    editLicenseLabel
} = require('./edit-license');

module.exports = {
    editTitleScene,
    editTagsScene,
    editSTEMSUrlScene,
    editWavUrlScene,
    editScaleScene,
    editPreviewAudioScene,
    editMP3UrlScene,
    editImageScene,
    editBPMScene,
    beatDeletionConfirmationScene,
    editMoodsScene,
    editGenresScene,
    createNewBeatScene,
    editLicensePrice,
    editLicenseLabel
}