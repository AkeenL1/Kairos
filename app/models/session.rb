class Session < ApplicationRecord
  validates :name, presence: true
  validates :focus_time, presence: true, numericality: { greater_than: 0 }
  validates :break_time, presence: true, numericality: { greater_than: 0 }
end
