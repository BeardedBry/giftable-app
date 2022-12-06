import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


const RemoveButton = ({ children, action }: { children: React.ReactChild, action: any }) => {
  return (
    <Popup
      trigger={<button className="bg-slate-300 text-sm mr-2 p-2 rounded">Remove</button>}
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
                Yes, Remove it 🫡</button>
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

export default RemoveButton;