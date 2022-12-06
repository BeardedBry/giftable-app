import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


const PurchaseButton = ({ children, action }: { children: React.ReactChild, action: any }) => {
  return (
    <Popup
      trigger={<button className="bg-gray-300 border text-sm p-2 rounded">🎁 Mark as Purchased</button>}
      // position="center",
      modal
    >
      {close => {

        const c = children;
        return (
          <div className="p-3">
            <div className="flex flex-col pb-1">
              {c}
            </div>
            <div className="flex justify-between border-t pt-1">
              <button
                onClick={async () => {
                  await action();
                  close();
                }}
              >
                🎁 Yes, I have purchased this</button>
              {" | "}
              <button
                onClick={() => {
                  close();
                }}
              >❌ No</button>
            </div>
          </div>
        )
      }}
    </Popup>
  )
}

export default PurchaseButton;