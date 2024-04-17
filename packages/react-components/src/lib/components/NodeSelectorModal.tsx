import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import clsx from 'clsx';
import { useAgoricNetwork } from '../hooks';
import BldIcon from '../icons/Bld';
import type { ChangeEvent } from 'react';

export type NodeSelectorModalProps = {
  isOpen?: boolean;
  onClose: () => void;
};

export const NodeSelectorModal = ({
  onClose,
  isOpen = false,
}: NodeSelectorModalProps) => {
  const { networkConfig, setNetworkConfig } = useAgoricNetwork();
  const defaultRest = networkConfig?.apis?.rest?.at(0);
  const defaultRpc = networkConfig?.apis?.rpc?.at(0);
  assert(
    setNetworkConfig && defaultRest && defaultRpc,
    'Network context missing',
  );

  const [rest, setRest] = useState(defaultRest as string);
  const [rpc, setRpc] = useState(defaultRpc as string);
  const [initialRest] = useState(rest);
  const [initialRpc] = useState(rpc);

  const isNetworkUnchanged =
    (initialRest === rest && initialRpc === rpc) || !rpc || !rest;

  const save = () => {
    setNetworkConfig({
      apis: { rpc: [rpc], rest: [rest] },
      testChain: networkConfig?.testChain,
    });
    onClose();
  };

  const cancel = () => {
    onClose();
    setRest(initialRest);
    setRpc(initialRpc);
  };

  const inputClasses =
    'text-base text-gray-800 bg-gray-100 rounded-md border-none py-1 px-3 shadow-sm w-full box-border text-base';

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center cursor-pointer">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="overflow-visible cursor-default max-w-2xl mx-3 transform rounded-lg bg-white text-left align-middle shadow-card transition-all">
                <Dialog.Title
                  as="div"
                  className="font-sans text-2xl text-white font-medium p-6 bg-[#BB2D40] rounded-t-lg flex items-center gap-1"
                >
                  <BldIcon />
                  Configure Agoric Connection
                </Dialog.Title>
                <div className="text-gray-500 mt-4 mx-8">
                  <div className="text-sm max-h-96">
                    <p className="mb-1">RPC Endpoint:</p>
                    <input
                      className={inputClasses}
                      type="url"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setRpc(e.target.value);
                      }}
                      value={rpc}
                    />
                    <p className="mb-1">API Endpoint:</p>
                    <input
                      className={inputClasses}
                      type="url"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setRest(e.target.value);
                      }}
                      value={rest}
                    />
                  </div>
                </div>
                <div className="pt-10 pb-6 px-8">
                  <div className="flex justify-end gap-6">
                    <button
                      className="cursor-pointer transition text-btn-xs text-gray-500 rounded-md border-transparent py-3 px-7 font-bold bg-gray-500 bg-opacity-10 hover:bg-opacity-20 active:bg-opacity-30"
                      onClick={cancel}
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isNetworkUnchanged}
                      className={clsx(
                        'transition text-btn-xs flex justify-center rounded border border-transparent text-white px-16 py-3',
                        isNetworkUnchanged
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-[#BB2D40] hover:opacity-80 active:opacity-60 cursor-pointer',
                      )}
                      onClick={save}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
