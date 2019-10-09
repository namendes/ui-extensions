// document.addEventListener('DOMContentLoaded', async () => {
//   try {
//     const ui = await UiExtension.register();
//     const brDocument = await ui.document.get();
//     const value = await ui.document.field.getValue();
//
//     showFieldValue(value);
//     initSetFieldValueButton(ui, brDocument.mode);
//
//   } catch (error) {
//     console.error('Failed to register extension:', error.message);
//     console.error('- error code:', error.code);
//   }
// });


async function init() {
  try {
    ui = await UiExtension.register();
    ({ mode } = await ui.document.get());

    initDialogButton();
    updatePreview();
    ui.document.field.setHeight('auto');
  } catch(error) {
    console.error('Failed to register extension:', error.message);
    console.error('- error code:', error.code);
  }
}

function initDialogButton() {
  const buttonElement = document.getElementById('open-dialog-button');
  if (mode !== 'edit') {
    buttonElement.style.display = 'none';
    return;
  }

  const options = {
    title: 'Bynder',
    url: './dialog.html',
    size: 'large',
    value: '',
  };

  buttonElement.style.display = 'block';
  buttonElement.addEventListener('click', () => showDialog(options));
}

async function showDialog(options) {
  try {
    const curvalue = await ui.document.field.getValue();
    options.value = curvalue;
    const newvalue = await ui.dialog.open(options);
    await ui.document.field.setValue(newvalue);
    await updatePreview();
  } catch (error) {
    if (error.code === 'DialogCanceled') {
      return;
    }

    console.error('Error after open dialog: ', error.code, error.message);
  }
}

function initSetFieldValueButton(ui, mode) {
  const buttonElement = document.querySelector('#setFieldValue');
  if (mode !== 'edit') {
    buttonElement.style.display = 'none';
    return;
  }

  buttonElement.style.display = 'block';
  buttonElement.addEventListener('click', async () => {
    try {
      var value = 'Hello Button';
      ui.document.field.setValue(value);
      showFieldValue(value);
    } catch (error) {
      console.error('Error: ', error.code, error.message);
    }
  });
}

function showFieldValue(value) {
  document.querySelector('#fieldValue').innerHTML = value;
}
