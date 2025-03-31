import { useRef, useState } from 'react'
import 'handsontable/dist/handsontable.full.min.css'
import './styles.css'
import { registerAllModules } from 'handsontable/registry'
import { HotTable, HotTableClass } from '@handsontable/react'
import { formatValue } from 'react-currency-input-field'
import { RowObject } from 'node_modules/handsontable/common'

registerAllModules()

const paymentDivisionOptions = [
  'Development / Investment / Legal (D)',
  'EPC (C)',
  'SPV CAPEX (S)',
]

function App() {
  const hotTableComponentRef = useRef<HotTableClass>(null)

  const [totalAmount, setTotalAmount] = useState(0)

  const ShowTotalAmount = () => {
    return  (
      totalAmount !== 0 && (
        <div>
          Total Amount:  <span className='text-red-500'>
            {formatValue({
                  value: `${totalAmount}`,
                  groupSeparator: ',',
                  decimalSeparator: '.',
                  prefix: `€ `,
                  decimalScale: 2,
            })}
          </span>
        </div>
      )
    )
  }

  const columns = [
    {
      data: 'paymentDivision',
      type: 'autocomplete',
      source: paymentDivisionOptions,
      strict: true,
      allowInvalid: true,
      placeholder: 'Payment Division',
      trimDropdown: false,
      title: 'Payment Division *',
    },
    {
      data: 'unitQuantity',
      type: 'numeric',
      numericFormat: {
        pattern: '0,0.00',
      },
      className: 'htRight',
      placeholder: '0.00',
      title: 'Qty. *',
    },
    {
      data: 'unitPrice',
      type: 'numeric',
      numericFormat: {
        pattern: '0,0.00',
      },
      className: 'htRight',
      placeholder: '0.00',
      title: 'Price *',
    },
  ]

  return (
    <>
        <div className="pb-2 flex w-full">
          <div className="w-1/2">
            <div className='text-2xl font-semibold'>Bulk PO Form </div>
          </div>
          <div className="w-1/2 flex justify-end">
            <ShowTotalAmount/>
          </div>
        </div>
      <HotTable
        ref={hotTableComponentRef}
        dataSchema={{ unit: 'EA', unitQuantity: 0, unitPrice: 0, isSPV: 'false', paymentTerms: 'Immediate Payment (V000)' }}
        height='auto'
        width='auto'
        // colHeaders={colHeaders}
        minRows={20}
        dropdownMenu={true}
        hiddenColumns={{
          indicators: true,
        }}
        contextMenu={true}
        rowHeaders={true}
        // headerClassName="htLeft"
        // manualRowMove={true}
        // multiColumnSorting={false}
        // minSpareCols={2}
        // filters={false}
        allowInsertRow={true}
        // beforeRenderer={addClassesToRows}
        autoWrapRow={false}
        autoWrapCol={false}
        navigableHeaders={true}
        viewportRowRenderingOffset={10}
        licenseKey={import.meta.env.VITE_HANDSONTABLE_LICENSE_KEY}
        // afterChange={}
        afterChange={(changes, source) => {

          const hotInstance = hotTableComponentRef.current?.hotInstance;
          const totalAmount = hotInstance?.getSourceData()
                    // .filter((row: RowObject) => row.project)
                    .map((row: RowObject) => row.unitPrice * row.unitQuantity)
                    .reduce((a, b) => a + b, 0) || 0

          setTotalAmount(totalAmount)
          console.log(totalAmount)
      
        }}
        columns={columns}
      />
      <ShowTotalAmount/>
    </>
  )
}

export default App
