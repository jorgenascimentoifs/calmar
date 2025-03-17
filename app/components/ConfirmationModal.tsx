"use client"

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmationModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <div className="fixed inset-0 bg-[#4A4A4A]/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex justify-center items-center">
          <Dialog.Panel className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold text-[#2F6874] mb-2">
              {title}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-[#39555C]/80 mb-6">
              {message}
            </Dialog.Description>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-lg border border-[#2F6874] px-4 py-2 text-sm font-medium text-[#2F6874] hover:bg-[#A0CEC9]/20 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onConfirm()
                  onClose()
                }}
                className="rounded-lg bg-gradient-to-r from-[#478E89] to-[#2F6874] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                Confirmar
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  )
} 